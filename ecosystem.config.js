module.exports = {
    apps: [
        {
            name: 'wap',
            script: 'npm',
            args: 'run start',
            autorestart: true,
            max_restarts: 5,
            max_memory_restart: '500M',
            restart_delay: 1000,
            watch: false,
            log_date_format: 'YYYY-MM-DD HH:mm Z',
            pmx: true,
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
}
