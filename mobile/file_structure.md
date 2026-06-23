```
lib/
├── main.dart
├── app.dart
│
├── api/
│   ├── api_client.dart
│   ├── api_endpoints.dart
│   ├── api_response_handler.dart
│   └── interceptors/
│       ├── auth_interceptor.dart
│       └── logging_interceptor.dart
│
├── controllers/
│   ├── poster/
│   │   ├── applicant_controller.dart
│   │   ├── dashboard_controller.dart
│   │   ├── earnings_controller.dart
│   │   └── gig_management_controller.dart
│   ├── shared/
│   │   ├── auth_controller.dart
│   │   ├── chat_controller.dart
│   │   ├── language_controller.dart
│   │   ├── notification_controller.dart
│   │   └── theme_controller.dart
│   └── worker/
│       ├── application_controller.dart
│       ├── dashboard_controller.dart
│       ├── home_controller.dart
│       └── search_controller.dart
│
├── core/
│   ├── constants/
│   │   ├── api_constants.dart
│   │   ├── app_constants.dart
│   │   ├── asset_constants.dart
│   │   └── role_constants.dart
│   ├── errors/
│   │   ├── exceptions.dart
│   │   └── failure.dart
│   ├── extensions/
│   │   └── context_extensions.dart
│   ├── storage/
│   │   └── secure_storage.dart
│   └── theme/
│       ├── app_colors.dart
│       ├── app_dimensions.dart
│       ├── app_text_styles.dart
│       └── app_theme.dart
│
├── dto/
│   ├── application/
│   │   ├── application_dto.dart
│   │   └── application_status_dto.dart
│   ├── auth/
│   │   ├── login_request_dto.dart
│   │   ├── password_reset_dto.dart
│   │   └── register_request_dto.dart
│   ├── category/
│   │   └── category_dto.dart
│   ├── dashboard/
│   │   └── dashboard_dto.dart
│   ├── gig/
│   │   ├── create_gig_dto.dart
│   │   ├── gig_dto.dart
│   │   └── gig_filter_dto.dart
│   ├── message/
│   │   ├── conversation_dto.dart
│   │   └── message_dto.dart
│   ├── notification/
│   │   └── notification_dto.dart
│   ├── review/
│   │   └── review_dto.dart
│   ├── settings/
│   │   └── settings_dto.dart
│   ├── university/
│   │   └── university_dto.dart
│   └── user/
│       └── user_dto.dart
│
├── middleware/
│   ├── auth_middleware.dart
│   ├── connectivity_middleware.dart
│   └── role_guard_middleware.dart
│
├── pages/
│   ├── auth/
│   │   ├── email_verification_page.dart
│   │   ├── forgot_password_page.dart
│   │   ├── login_page.dart
│   │   ├── register_page.dart
│   │   └── role_selection_page.dart
│   ├── onboarding/
│   │   └── onboarding_page.dart
│   ├── poster/
│   │   ├── applicants/
│   │   │   ├── applicant_detail_page.dart
│   │   │   └── applicants_page.dart
│   │   ├── chat/
│   │   │   ├── chat_list_page.dart
│   │   │   └── chat_page.dart
│   │   ├── dashboard/
│   │   │   └── poster_dashboard_page.dart
│   │   ├── earnings/
│   │   │   ├── earnings_page.dart
│   │   │   └── earnings_report_page.dart
│   │   ├── gigs/
│   │   │   ├── create_gig_page.dart
│   │   │   ├── edit_gig_page.dart
│   │   │   ├── gig_detail_page.dart
│   │   │   └── manage_gigs_page.dart
│   │   ├── poster_shell.dart
│   │   ├── profile/
│   │   │   ├── edit_profile_page.dart
│   │   │   └── profile_page.dart
│   │   └── settings/
│   │       ├── notification_preferences_page.dart
│   │       └── settings_page.dart
│   ├── shared/
│   │   ├── error/
│   │   │   ├── no_internet_page.dart
│   │   │   └── not_found_page.dart
│   │   ├── freelancers/
│   │   │   └── freelancer_directory_page.dart
│   │   ├── notifications/
│   │   │   └── notifications_page.dart
│   │   ├── settings/
│   │   │   └── language_settings_page.dart
│   │   └── universities/
│   │       └── university_request_page.dart
│   ├── splash/
│   │   └── splash_page.dart
│   └── worker/
│       ├── applications/
│       │   ├── application_detail_page.dart
│       │   └── my_applications_page.dart
│       ├── chat/
│       │   ├── chat_list_page.dart
│       │   └── chat_page.dart
│       ├── dashboard/
│       │   └── worker_dashboard_page.dart
│       ├── gig_detail/
│       │   └── gig_detail_page.dart
│       ├── home/
│       │   └── home_page.dart
│       ├── profile/
│       │   ├── edit_profile_page.dart
│       │   └── profile_page.dart
│       ├── saved/
│       │   └── saved_gigs_page.dart
│       ├── search/
│       │   ├── filter_page.dart
│       │   └── search_page.dart
│       ├── settings/
│       │   ├── notification_preferences_page.dart
│       │   └── settings_page.dart
│       └── worker_shell.dart
│
├── routes/
│   ├── app_router.dart
│   ├── role_based_routes.dart
│   └── route_names.dart
│
├── services/
│   ├── poster/
│   │   ├── application_service.dart
│   │   ├── dashboard_service.dart
│   │   ├── earnings_service.dart
│   │   ├── gig_management_service.dart
│   │   └── review_service.dart
│   ├── shared/
│   │   ├── auth_service.dart
│   │   ├── chat_service.dart
│   │   ├── notification_service.dart
│   │   ├── settings_service.dart
│   │   └── upload_service.dart
│   └── worker/
│       ├── application_service.dart
│       ├── dashboard_service.dart
│       ├── gig_service.dart
│       ├── review_service.dart
│       └── saved_gig_service.dart
│
└── widgets/
    ├── common/
    │   ├── buttons/
    │   │   └── app_button.dart
    │   ├── dialogs/
    │   │   └── confirm_dialog.dart
    │   ├── empty_states/
    │   │   └── empty_state.dart
    │   ├── inputs/
    │   │   └── app_text_field.dart
    │   └── loaders/
    │       └── app_loader.dart
    └── worker/
        ├── application_tile.dart
        ├── category_chip.dart
        ├── gig_card.dart
        ├── gig_list_tile.dart
        └── saved_gig_tile.dart
```
