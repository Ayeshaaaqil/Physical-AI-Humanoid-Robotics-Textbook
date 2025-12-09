from agents import Agent, Runner, OpenAIChatCompletionsModel, AsyncOpenAI
from agents import set_tracing_disabled, function_tool
import os
from dotenv import load_dotenv # Keep this for GEMINI_API_KEY
from agents import enable_verbose_stdout_logging

enable_verbose_stdout_logging()

load_dotenv()
set_tracing_disabled(disabled=True)

gemini_api_key = os.getenv("GEMINI_API_KEY")
os.environ["OPENAI_API_KEY"] = gemini_api_key # Explicitly set OPENAI_API_KEY
provider = AsyncOpenAI(
    api_key=gemini_api_key,
    base_url=os.getenv("GEMINI_BASE_URL")
)

model = OpenAIChatCompletionsModel(
    model="gemini-1.5-flash",
    openai_client=provider
)

from utils import retrieve # Import retrieve from utils.py



agent = Agent(
    name="Assistant",
    instructions="""
You are an AI tutor for the Physical AI & Humanoid Robotics textbook.
To answer the user question, first call the tool `retrieve` with the user query.
Use ONLY the returned content from `retrieve` to answer.
If the answer is not in the retrieved content, say "I don't know".
""",
    model=model,
    tools=[retrieve]
)

result = Runner.run_sync(
    agent,
    input="what is physical ai?",
)

print(result.final_output)