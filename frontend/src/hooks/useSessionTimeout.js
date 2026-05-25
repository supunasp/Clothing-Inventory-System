import { useCallback, useEffect, useRef, useState } from "react";

const ACTIVITY_EVENTS = [
    "mousedown",
    "mousemove",
    "keydown",
    "scroll",
    "touchstart",
    "click",
];

const useSessionTimeout = ({ idleTimeMs, warningBeforeMs, onExpire }) => {
    const [isWarning, setIsWarning] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);

    const warningTimerRef = useRef(null);
    const expiryTimerRef = useRef(null);
    const countdownIntervalRef = useRef(null);
    const isWarningRef = useRef(false);
    const onExpireRef = useRef(onExpire);

    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    useEffect(() => {
        isWarningRef.current = isWarning;
    }, [isWarning]);

    const clearAll = () => {
        clearTimeout(warningTimerRef.current);
        clearTimeout(expiryTimerRef.current);
        clearInterval(countdownIntervalRef.current);
    };

    const startTimers = useCallback(() => {
        clearAll();
        warningTimerRef.current = setTimeout(() => {
            setIsWarning(true);
            setSecondsLeft(Math.floor(warningBeforeMs / 1000));
            countdownIntervalRef.current = setInterval(() => {
                setSecondsLeft((current) => Math.max(current - 1, 0));
            }, 1000);
        }, idleTimeMs - warningBeforeMs);

        expiryTimerRef.current = setTimeout(() => {
            clearAll();
            setIsWarning(false);
            if (onExpireRef.current) onExpireRef.current();
        }, idleTimeMs);
    }, [idleTimeMs, warningBeforeMs]);

    const extendSession = useCallback(() => {
        setIsWarning(false);
        startTimers();
    }, [startTimers]);

    useEffect(() => {
        startTimers();

        const handleActivity = () => {
            if (!isWarningRef.current) {
                startTimers();
            }
        };

        ACTIVITY_EVENTS.forEach((event) =>
            window.addEventListener(event, handleActivity)
        );

        return () => {
            ACTIVITY_EVENTS.forEach((event) =>
                window.removeEventListener(event, handleActivity)
            );
            clearAll();
        };
    }, [startTimers]);

    return { isWarning, secondsLeft, extendSession };
};

export default useSessionTimeout;
