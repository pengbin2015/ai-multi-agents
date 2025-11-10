{source_code_folder} = ./todo-list-typescript-main
{instruction_folder} = ./understanding-code/instruction-generation
{output_folder} = .results
{final_output_file} = .github/copilot-instructions.md

You are assisting with generating a {final_output_file} file using a multi-step prompt chain for the source code in the `{source_code_folder}`.

1. Navigate to the `{instruction_folder}` folder within the repo.
2. Review all the prompt files in this folder WITHOUT executing them. 
    - This will help you understand the full scope of the prompt chain.
3. Confirm you have a full understanding of the prompt chain sequence.
4. Once you're familiar with the flow, begin executing the prompts in numerical order:
    - 1-determine-techstack.md
    - 2-categorize-files.md
    - 3-identify-architecture.md
    - 4-domain-deep-dive.md
    - 5-styleguide-generation.md
    - 6-build-instructions.md
5. For each step, output results into a corresponding `{output_folder}/` folder.
    - Mirror the step’s filename e.g., `1-determine-techstack.md` > `{output_folder}/1-determine-techstack.md`.

Stop ONLY when:
    - All `instruction-generation` steps are complete
    - A full `{final_output_file}` can be generated.
