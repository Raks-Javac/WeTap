from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.users.models import User
from apps.wallets.models import Wallet
from apps.kyc.models import KYCProfile


@receiver(post_save, sender=User)
def bootstrap_user_profile(sender, instance: User, created: bool, **kwargs):
    if created:
        Wallet.objects.get_or_create(
            user=instance,
            defaults={
                "virtual_account_number": str(abs(hash(instance.email)))[:10],
                "virtual_account_name": instance.full_name or instance.email,
                "virtual_bank_name": "WeTap Bank",
            },
        )
        KYCProfile.objects.get_or_create(user=instance)
