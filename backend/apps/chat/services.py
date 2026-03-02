from apps.chat.models import ChatThread, ChatMessage


def send_message(user, text: str, thread_id=None):
    thread = ChatThread.objects.filter(id=thread_id, user=user).first() if thread_id else None
    if not thread:
        thread = ChatThread.objects.create(user=user, title="Support")

    ChatMessage.objects.create(thread=thread, role=ChatMessage.ROLE_USER, content=text)

    action = {}
    lower = text.lower()
    if "transfer" in lower:
        action = {"type": "navigate", "route": "/app/transfers/new", "prefill": {"amount": ""}}
    assistant_reply = "I can help with payments, transfers, bills, cards, or KYC."

    ChatMessage.objects.create(thread=thread, role=ChatMessage.ROLE_ASSISTANT, content=assistant_reply, action=action)
    return thread, assistant_reply, action
