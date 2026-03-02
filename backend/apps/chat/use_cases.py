from apps.chat.models import ChatMessage
from .repositories import ChatRepository


def send_message(user, text: str, thread_id=None):
    thread = ChatRepository.thread_for_user(user=user, thread_id=thread_id)
    if not thread:
        thread = ChatRepository.create_thread(user=user)

    ChatRepository.add_message(thread=thread, role=ChatMessage.ROLE_USER, content=text)

    action = {}
    lower = text.lower()
    if "transfer" in lower:
        action = {"type": "navigate", "route": "/app/transfers/new", "prefill": {"amount": ""}}
    assistant_reply = "I can help with payments, transfers, bills, cards, or KYC."

    ChatRepository.add_message(thread=thread, role=ChatMessage.ROLE_ASSISTANT, content=assistant_reply, action=action)
    return thread, assistant_reply, action
