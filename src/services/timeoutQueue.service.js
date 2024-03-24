class TimeOutQueue {
    constructor(onTimeout) {
        this.queue = [];
        this.onTimeout = onTimeout;
    }

    _getByGuildId(id) {
        for (const q of this.queue) {
            if (q.guildId == id) {
                return q;
            }
        }
        return null;
    }

    addToQueue(guildId, playBackLength = 0) {
        let guild = this._getByGuildId(guildId);

        if (guild) {
            clearInterval(guildId.timeoutId);
            this.queue.splice(this.queue.indexOf(guild), 1);
        }

        let timeout = setTimeout(() => this.onTimeout(guildId), Number(process.env.DESTROY_VOICE_CONNECTION_TIMEOUT) + playBackLength);
        this.queue.push({
            guildId: guildId,
            timeoutId: timeout,
        });
    }
}

module.exports = {
    TimeOutQueue,
}