from django.urls import path
from api.v1 import views

urlpatterns = [
    path("auth/otp/request", views.OTPRequestView.as_view()),
    path("auth/otp/verify", views.OTPVerifyView.as_view()),
    path("auth/logout", views.LogoutView.as_view()),
    path("auth/token/refresh", views.WrappedTokenRefreshView.as_view()),

    path("users/me", views.UserMeView.as_view()),
    path("users/me/onboarding/complete", views.CompleteOnboardingView.as_view()),
    path("users/me/change-pin", views.ChangePinView.as_view()),
    path("users/me/kyc", views.SubmitKYCView.as_view()),
    path("users/me/dashboard", views.DashboardView.as_view()),

    path("cards/provision", views.CardProvisionView.as_view()),

    path("payments/fund", views.FundWalletView.as_view()),
    path("payments/nfc/execute", views.NFCExecuteView.as_view()),

    path("nfc/initiate", views.NFCInitiateView.as_view()),

    path("bills/categories", views.BillCategoryView.as_view()),
    path("bills/providers", views.BillProviderView.as_view()),
    path("bills/validate", views.BillValidateView.as_view()),
    path("bills/pay", views.BillPayView.as_view()),

    path("banks", views.BanksView.as_view()),
    path("transfers/resolve-account", views.ResolveAccountView.as_view()),
    path("transfers/resolve-wetap-id", views.ResolveWetapView.as_view()),
    path("transfers/initiate", views.TransferInitiateView.as_view()),

    path("transactions", views.TransactionListView.as_view()),
    path("transactions/<str:ref>", views.TransactionDetailView.as_view()),

    path("chat/message", views.ChatMessageView.as_view()),
    path("chat/threads", views.ChatThreadsView.as_view()),

    path("admin/auth/login", views.AdminLoginView.as_view()),
    path("admin/dashboard/stats", views.AdminDashboardStatsView.as_view()),
    path("admin/transactions", views.AdminTransactionsView.as_view()),
    path("admin/users", views.AdminUsersView.as_view()),
    path("admin/users/<uuid:user_id>", views.AdminUserDetailView.as_view()),
    path("admin/users/<uuid:user_id>/kyc/approve", views.AdminKYCApproveView.as_view()),
    path("admin/users/<uuid:user_id>/kyc/reject", views.AdminKYCRejectView.as_view()),
    path("admin/cards", views.AdminCardsView.as_view()),
    path("admin/cards/<uuid:card_id>/block", views.AdminCardBlockView.as_view()),
    path("admin/audit-logs", views.AdminAuditLogsView.as_view()),
]
