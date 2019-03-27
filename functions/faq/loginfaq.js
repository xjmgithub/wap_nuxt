export default function(v) {
    // v.$store.state.lang
    return {
        1: {
            key: '01',
            name: v.$store.state.lang.loginfaq_signway_hasproblem,
            items: [
                {
                    name: 'Facebook',
                    child: 11
                },
                {
                    name: 'Google',
                    child: 12
                },
                {
                    name: 'Twitter',
                    child: 13
                }
            ]
        },
        11: {
            key: '01-1',
            name: v.$store.state.lang.loginfaq_toast_disappeared,
            items: [
                {
                    name: v.$store.state.lang.loginfaq_poor_network_to_access_Facebook,
                    child: 111
                },
                {
                    name: v.$store.state.lang.loginfaq_I_cancelled,
                    child: 112
                }
            ]
        },
        12: {
            key: '01-2',
            name: v.$store.state.lang.loginfaq_toast_disappeared,
            items: [
                {
                    name: v.$store.state.lang.loginfaq_poor_network_to_access_Google,
                    child: 121
                },
                {
                    name: v.$store.state.lang.loginfaq_please_update_your_google_play,
                    child: 122
                },
                {
                    name: v.$store.state.lang.loginfaq_cant_log_on_Google_due_to_network,
                    child: 9001
                },
                {
                    name: v.$store.state.lang.loginfaq_I_cancelled,
                    child: 9001
                }
            ]
        },
        13: {
            items: [],
            name: v.$store.state.lang.loginfaq_Twitter_SDK_repairing,
            key: '01-3'
        },
        111: {
            key: '01-1-1',
            name: v.$store.state.lang.loginfaq_Why_cancelled,
            items: [
                {
                    name: v.$store.state.lang.loginfaq_loading_allthetime_towait,
                    child: 9001
                },
                {
                    name: v.$store.state.lang.loginfaq_something_wrong_with_Facebook,
                    child: 9001
                },
                {
                    name: v.$store.state.lang.loginfaq_dont_want_grant_access_about_permission,
                    child: 9001
                },
                {
                    name: v.$store.state.lang.loginfaq_have_grant_access_permission,
                    child: 9001
                },
                {
                    name: v.$store.state.lang.loginfaq_other_reason,
                    child: 9002
                }
            ]
        },
        112: {
            key: '01-1-2',
            name: v.$store.state.lang.loginfaq_signed_success_lastest_week,
            items: [
                {
                    name: v.$store.state.lang.loginfaq_yes,
                    child: 9001
                },
                {
                    name: v.$store.state.lang.loginfaq_no,
                    child: 9001
                }
            ]
        },
        121: {
            key: '01-2-1',
            name: v.$store.state.lang.loginfaq_Why_cancelled,
            items: [
                {
                    name: v.$store.state.lang.loginfaq_loading_allthetime_towait,
                    child: 9001
                },
                {
                    name: v.$store.state.lang.loginfaq_something_wrong_with_Facebook,
                    child: 9001
                },
                {
                    name: v.$store.state.lang.loginfaq_other_reason,
                    child: 9002
                }
            ]
        },
        122: {
            key: '01-2-2',
            name: v.$store.state.lang.loginfaq_signed_success_lastest_week,
            items: [
                {
                    name: v.$store.state.lang.loginfaq_yes,
                    child: 9001
                },
                {
                    name: v.$store.state.lang.loginfaq_no,
                    child: 9001
                }
            ]
        },
        9001: {
            items: [],
            name: v.$store.state.lang.loginfaq_thanks_for_your_feedback,
            key: '02'
        }
    }
}
