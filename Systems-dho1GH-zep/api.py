"""
Simple Flask API wrapper for cloud deployment
Provides REST endpoints for the OpenAI and Zep Agent
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import uuid
from typing import Dict, Any
from agent import ZepOpenAIAgent
from agent_enhanced import EnhancedZepOpenAIAgent
from config import Config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Store active sessions in memory (use Redis/database for production)
active_sessions: Dict[str, Any] = {}


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        Config.validate()
        return jsonify({
            'status': 'healthy',
            'version': '1.0.0',
            'features': {
                'basic_agent': True,
                'enhanced_agent': True,
                'conversational_graph': True,
                'dynamic_context': True
            }
        }), 200
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({
            'status': 'unhealthy',
            'error': 'Configuration error'
        }), 503


@app.route('/api/v1/chat', methods=['POST'])
def chat():
    """
    Chat endpoint for basic agent
    
    Request body:
    {
        "session_id": "optional-session-id",
        "message": "Your message here",
        "use_history": true
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Request body is required'}), 400
        
        message = data.get('message', '').strip()
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        session_id = data.get('session_id') or str(uuid.uuid4())
        use_history = data.get('use_history', True)
        
        # Get or create agent for this session
        if session_id not in active_sessions:
            active_sessions[session_id] = ZepOpenAIAgent(session_id=session_id)
        
        agent = active_sessions[session_id]
        response = agent.chat(message, use_history=use_history)
        
        return jsonify({
            'session_id': session_id,
            'message': message,
            'response': response,
            'use_history': use_history
        }), 200
        
    except ValueError as e:
        logger.warning(f"Validation error: {e}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/api/v1/chat/enhanced', methods=['POST'])
def chat_enhanced():
    """
    Chat endpoint for enhanced agent with graph and dynamic context
    
    Request body:
    {
        "session_id": "optional-session-id",
        "message": "Your message here",
        "use_history": true,
        "use_dynamic_context": true,
        "enable_graph": true
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Request body is required'}), 400
        
        message = data.get('message', '').strip()
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        session_id = data.get('session_id') or str(uuid.uuid4())
        use_history = data.get('use_history', True)
        use_dynamic_context = data.get('use_dynamic_context', False)
        enable_graph = data.get('enable_graph', True)
        
        # Get or create enhanced agent for this session
        session_key = f"enhanced_{session_id}"
        if session_key not in active_sessions:
            active_sessions[session_key] = EnhancedZepOpenAIAgent(
                session_id=session_id,
                enable_graph=enable_graph
            )
        
        agent = active_sessions[session_key]
        response = agent.chat(
            message,
            use_history=use_history,
            use_dynamic_context=use_dynamic_context
        )
        
        # Get graph stats if enabled
        graph_stats = None
        if enable_graph and hasattr(agent, 'graph'):
            graph_stats = agent.get_graph_stats()
        
        return jsonify({
            'session_id': session_id,
            'message': message,
            'response': response,
            'use_history': use_history,
            'use_dynamic_context': use_dynamic_context,
            'graph_stats': graph_stats
        }), 200
        
    except ValueError as e:
        logger.warning(f"Validation error: {e}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Enhanced chat error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/api/v1/session/<session_id>/clear', methods=['POST'])
def clear_session(session_id: str):
    """Clear memory for a specific session"""
    try:
        # Clear basic agent
        if session_id in active_sessions:
            agent = active_sessions[session_id]
            agent.clear_memory()
            del active_sessions[session_id]
        
        # Clear enhanced agent
        enhanced_key = f"enhanced_{session_id}"
        if enhanced_key in active_sessions:
            agent = active_sessions[enhanced_key]
            agent.clear_memory()
            del active_sessions[enhanced_key]
        
        return jsonify({
            'session_id': session_id,
            'status': 'cleared'
        }), 200
        
    except Exception as e:
        logger.error(f"Clear session error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/api/v1/session/<session_id>/graph', methods=['GET'])
def get_graph(session_id: str):
    """Get conversation graph statistics"""
    try:
        enhanced_key = f"enhanced_{session_id}"
        if enhanced_key not in active_sessions:
            return jsonify({'error': 'Session not found or not using enhanced agent'}), 404
        
        agent = active_sessions[enhanced_key]
        if not hasattr(agent, 'graph'):
            return jsonify({'error': 'Graph not enabled for this session'}), 400
        
        stats = agent.get_graph_stats()
        branches = agent.get_conversation_branches()
        
        return jsonify({
            'session_id': session_id,
            'stats': stats,
            'branches': [
                {'node_id': node_id, 'content': content[:100]}
                for node_id, content in branches
            ]
        }), 200
        
    except Exception as e:
        logger.error(f"Get graph error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/api/v1/sessions', methods=['GET'])
def list_sessions():
    """List all active sessions"""
    try:
        basic_sessions = [
            sid for sid in active_sessions.keys()
            if not sid.startswith('enhanced_')
        ]
        enhanced_sessions = [
            sid.replace('enhanced_', '')
            for sid in active_sessions.keys()
            if sid.startswith('enhanced_')
        ]
        
        return jsonify({
            'basic_sessions': basic_sessions,
            'enhanced_sessions': enhanced_sessions,
            'total': len(active_sessions)
        }), 200
        
    except Exception as e:
        logger.error(f"List sessions error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal error: {error}")
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    # Get port from environment or use default
    import os
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    logger.info(f"Starting Flask API server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
