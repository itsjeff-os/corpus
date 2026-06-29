# GitHub Copilot Instructions for Systems Repository

This file provides guidance to GitHub Copilot for working with this repository. Follow these instructions when generating code, reviewing changes, or assisting with development tasks.

## General Guidelines

- Write clear, maintainable, and well-documented code
- Follow established coding conventions and best practices
- Keep changes minimal and focused on the specific task
- Ensure backward compatibility unless explicitly breaking changes are required

## Code Style and Formatting

- Use consistent indentation and formatting throughout the codebase
- Follow language-specific style guides (e.g., PEP 8 for Python, Prettier with ESLint or Airbnb's JavaScript Style Guide for JS)
- Use meaningful variable and function names that clearly describe their purpose
- Keep functions and methods focused on a single responsibility
- Avoid unnecessary complexity; prefer simple, readable solutions

## Documentation

- Document all public APIs, functions, and classes
- Use clear and concise comments to explain complex logic or non-obvious decisions
- Update README.md and other documentation when adding new features or changing behavior
- Include usage examples in documentation where appropriate
- Keep documentation up-to-date with code changes

## Testing

- Write tests for new features and bug fixes
- Ensure existing tests pass before committing changes
- Aim for good test coverage of critical functionality
- Use descriptive test names that explain what is being tested
- Test both success cases and error conditions

## Security

- Never commit secrets, API keys, or sensitive credentials to the repository
- Validate and sanitize all external inputs
- Use secure defaults for authentication and authorization
- Follow the principle of least privilege
- Be cautious with dependencies; keep them updated and minimal

## Git and Version Control

- Write clear, descriptive commit messages
- Keep commits atomic and focused on a single change
- Reference issue numbers in commit messages when applicable (e.g., 'Fixes #123' or 'Resolves #123')
- Avoid committing generated files, build artifacts, or dependencies

## Dependencies

- Minimize the number of external dependencies
- Use well-maintained, reputable libraries
- Document the purpose of each dependency
- Keep dependencies up-to-date for security and compatibility using automated tools like Dependabot or regular review schedules

## Error Handling

- Handle errors gracefully and provide meaningful error messages
- Use appropriate error types and exception handling mechanisms
- Log errors appropriately for debugging
- Fail fast when continuing would lead to incorrect behavior

## Performance

- Consider performance implications of code changes
- Avoid premature optimization; focus on correctness first
- Profile and measure before optimizing
- Document any performance-critical sections

## Collaboration

- Be respectful and constructive in code reviews
- Ask questions when requirements or context is unclear
- Provide context and reasoning for significant changes
- Follow the project's contribution guidelines
