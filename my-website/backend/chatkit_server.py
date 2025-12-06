from typing import Any, AsyncIterator, Generic, TypeVar

T = TypeVar("T")

class Store:
    async def load_thread_items(self, thread_id, start_cursor, limit, order, context):
        # Placeholder for store logic
        return DummyPage()

    def generate_item_id(self, item_type, thread, context):
        # Placeholder for ID generation logic
        return f"{item_type}-{hash(thread.id)}-{hash(context)}"

class ThreadMetadata:
    def __init__(self, id: str):
        self.id = id

class ThreadItemConverter:
    async def to_agent_input(self, all_items):
        # Placeholder for converting thread items to agent input
        return []

class DummyPage(Generic[T]):
    def __init__(self):
        self.data: List[T] = []

class ChatKitServer(Generic[T]):
    def __init__(self, data_store: Store):
        self.store = data_store

    async def respond(self, thread: ThreadMetadata, input: Any, context: T) -> AsyncIterator:
        yield {"type": "dummy.response", "content": "This is a dummy ChatKitServer response."}
