from rest_framework import serializers


class OTPRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.RegexField(regex=r"^\d{4}$")


class OnboardingSerializer(serializers.Serializer):
    tap_mode = serializers.ChoiceField(choices=["one_tap", "two_tap"])
    pin_hash = serializers.CharField()


class CardProvisionSerializer(serializers.Serializer):
    pan = serializers.CharField(required=False)
    expiry_month = serializers.CharField(required=False)
    expiry_year = serializers.CharField(required=False)
    cvv = serializers.CharField(required=False)
    encrypted_card_data = serializers.CharField(required=False)


class ChangePinSerializer(serializers.Serializer):
    current_pin = serializers.RegexField(regex=r"^\d{4}$", required=False)
    new_pin = serializers.RegexField(regex=r"^\d{4}$")


class FundWalletSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=14, decimal_places=2)


class NFCInitiateSerializer(serializers.Serializer):
    nfc_data = serializers.CharField()


class NFCExecuteSerializer(serializers.Serializer):
    session_id = serializers.UUIDField()
    card_id = serializers.UUIDField()
    method = serializers.ChoiceField(choices=["one_tap", "two_tap"])
    pin_hash = serializers.RegexField(regex=r"^\d{4}$", required=False)
    amount = serializers.DecimalField(max_digits=14, decimal_places=2)


class BillValidateSerializer(serializers.Serializer):
    provider = serializers.CharField()
    item_code = serializers.CharField()
    customer_identifier = serializers.CharField()


class BillPaySerializer(serializers.Serializer):
    category = serializers.CharField()
    provider = serializers.CharField()
    item_code = serializers.CharField()
    customer_identifier = serializers.CharField()
    amount = serializers.DecimalField(max_digits=14, decimal_places=2)


class ResolveAccountSerializer(serializers.Serializer):
    bank_code = serializers.CharField()
    account_number = serializers.CharField()


class ResolveWetapSerializer(serializers.Serializer):
    email = serializers.EmailField()


class TransferInitiateSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=14, decimal_places=2)
    bank_code = serializers.CharField(required=False)
    account_number = serializers.CharField(required=False)
    account_name = serializers.CharField(required=False)
    wetap_email = serializers.EmailField(required=False)


class KYCSubmitSerializer(serializers.Serializer):
    bvn = serializers.CharField(required=False)
    nin = serializers.CharField(required=False)
    address = serializers.CharField(required=False)


class ChatMessageSerializer(serializers.Serializer):
    message = serializers.CharField()
    thread_id = serializers.UUIDField(required=False)


class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)
    password = serializers.CharField()


class KYCRejectSerializer(serializers.Serializer):
    reason = serializers.CharField()
