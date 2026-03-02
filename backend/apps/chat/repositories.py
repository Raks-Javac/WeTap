from apps.chat.models import ChatThread, ChatMessage


class ChatRepository:
    @staticmethod
    def thread_for_user(user, thread_id):
        if not thread_id:
            return None
        return ChatThread.objects.filter(id=thread_id, user=user).first()

    @staticmethod
    def create_thread(user, title="Support"):
        return ChatThread.objects.create(user=user, title=title)

    @staticmethod
    def add_message(thread, role: str, content: str, action=None):
        return ChatMessage.objects.create(thread=thread, role=role, content=content, action=action or {})
