Mock.mock('/payment/api/v2/get-pre-payment', {
    'list|1-10': [
        {
            'id|+1': 1,
            email: '@EMAIL'
        }
    ]
})
