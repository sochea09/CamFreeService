module.exports = {
    driver: "redis",
    port: 6379,
    host: "127.0.0.1",
    options: {
//        parser: "hiredis",
        parser: "javascript",
        return_buffers: false,
        detect_buffers: false,
        socket_nodelay: true,
        socket_keepalive: true,
        no_ready_check: false,
        enable_offline_queue: true,
        retry_max_delay: null,
        connect_timeout: false,
        max_attempts: null,
        auth_pass: null,
        family: "IPv4"
    }
};
