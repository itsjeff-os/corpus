

class PatchEngine:

    def apply(self, original_text, verification_results):
        updated_text = original_text

        for result in verification_results:
            if result["verdict"] == "rewrite":
                # ### JUDGEMENT ### naive rewrite strategy
                updated_text = updated_text.replace("%", "")

        return updated_text
