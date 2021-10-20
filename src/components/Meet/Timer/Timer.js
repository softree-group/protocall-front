import {useEffect, useState} from "react";

let interval = null;

function Timer({startedTime, isRunning}) {
    const [time, setTime] = useState(null);

    useEffect(() => {
        if (isRunning && interval !== null) {
            return;
        }

        if (!isRunning && interval === null) {
            return;
        }

        if (!isRunning && interval !== null) {
            clearInterval(interval);
            interval = null;
            setTime('00:00');
            return;
        }

        interval = setInterval(() => {
            const now = new Date();
            const diff = new Date(now - startedTime);
            const hour = diff.getUTCHours();
            const min = (diff.getUTCMinutes() + "").padStart(2,"0");
            const sec = (diff.getUTCSeconds() + "").padStart(2, "0");

            const time = `${hour ? (hour + "").padStart(2, "0") + ':' : ''}${min}:${sec}`;
            setTime(time)
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, startedTime]);


    return (
        <div className="call-timer">{time}</div>
    )
}

export default Timer;
