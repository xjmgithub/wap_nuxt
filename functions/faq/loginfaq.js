export default function(v) {
    // v.$store.state.lang
    return {
        1: {
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
            ],
            name: 'Choose the way you cannot sign in successfully',
            key:'01'
        },
        11: {
            items: [
                {
                    name: 'Your access to Facebook service has failed due to network.',
                    child: 111
                },
                {
                    name: 'I cancelled',
                    child: 112
                }
            ],
            name: 'login-with-Facebook',
            key:'01-1'
        },
        12: {
            items: [
                {
                    name: 'Your access to Google service has failed due to network.',
                    child: 121
                },
                {
                    name: 'Please update your Google play to version 12.0 or above.',
                    child: 122
                },
                {
                    name: "You can't log on Google due to network connection issue",
                    child: 9001
                },
                {
                    name: 'I cancelled',
                    child: 9001
                }
            ],
            name: 'login-with-Google',
            key:'01-1'
        },
        13: {
            items: [],
            name: "Twitter's login SDK is repairing, you can try other way to login instead."
        },
        111: {
            items: [
                {
                    name: "It's loading all the time, I don't want to wait.",
                    child: 9001
                },
                {
                    name: 'I have something wrong with Facebook account.',
                    child: 9001
                },
                {
                    name: "I don't want to grant access about permission.",
                    child: 9001
                },
                {
                    name: 'I have grant access permission but already can`t login successfully.',
                    child: 9001
                },
                {
                    name: 'Other reason',
                    child: 9002
                }
            ],
            name: 'loginhelp_que_why'
        },
        112: {
            items: [
                {
                    name: 'YES',
                    child: 9001
                },
                {
                    name: 'NO',
                    child: 9001
                }
            ],
            name: 'loginhelp_que_why'
        },
        121: {
            items: [
                {
                    name: "It's loading all the time, I don't want to wait.",
                    child: 9001
                },
                {
                    name: 'I have something wrong with Google account.',
                    child: 9001
                },
                {
                    name: 'Other reason',
                    child: 9002
                }
            ],
            name: 'loginhelp_que_why'
        },
        122: {
            items: [
                {
                    name: 'YES',
                    child: 9001
                },
                {
                    name: 'NO',
                    child: 9001
                }
            ],
            name: 'loginhelp_que_gg'
        },
        9001: {
            items: [],
            name: "Thanks for your feedback，we'll try our best to solve this problem, and you can change other way for login."
        }
    }
}
