from .use_cases import OTPUseCase


class OTPService:
    TTL_SECONDS = OTPUseCase.TTL_SECONDS

    @staticmethod
    def request_otp(email: str, ip_address: str):
        return OTPUseCase.request_otp(email=email, ip_address=ip_address)

    @staticmethod
    def verify_otp(email: str, otp: str):
        return OTPUseCase.verify_otp(email=email, otp=otp)
