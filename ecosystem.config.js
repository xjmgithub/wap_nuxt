module.exports = {
    apps: [
        {
            name: 'wap',
            script: 'npm',
            args: 'run start',
            autorestart: true,
            max_memory_restart: '2G',
            watch: false,
            log_date_format: 'YYYY-MM-DD HH:mm Z',
            instances: 2,
            exec_mode: 'cluster',
            merge_logs: true,
            trace: true,
            pmx: true,
            env: {
                NODE_ENV: 'development'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ]
}
