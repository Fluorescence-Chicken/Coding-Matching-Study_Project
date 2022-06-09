from rest_access_policy import AccessPolicy


class AllowGetOnly(AccessPolicy):
    """
    Allow GET requests only(list, retrieve).
    """
    statements = [
        {
            'action': ["list", "retrieve"],
            'principal': "*",
            'effect': "allow",
        },
        {
            'action': ["create", "destroy", "update", "partial_update"],
            'principal': "authenticated",
            'effect': "allow",
        },
    ]

