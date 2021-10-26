import {useEffect, useMemo, useState} from "react";

function Timer({startedTime, isRunning}) {
    const [time, setTime] = useState(null);

    const work = () => {
        const now = new Date();
        const diff = new Date(now - startedTime);
        const hour = diff.getUTCHours();
        const min = (diff.getUTCMinutes() + "").padStart(2,"0");
        const sec = (diff.getUTCSeconds() + "").padStart(2, "0");

        const time = `${hour ? (hour + "").padStart(2, "0") + ':' : ''}${min}:${sec}`;
        setTime(time);
    }

    useEffect(() => {
        if (!isRunning) {
            setTime('00:00')
            return;
        }

        work();
        const interval = setInterval(() => {
            work();
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, startedTime]);


    return (
        <div className="call-timer">{time}</div>
    )
}

export default Timer;
