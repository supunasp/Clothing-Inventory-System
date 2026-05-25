import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useSessionTimeout from "../../hooks/useSessionTimeout";

const FALLBACK_IDLE_MINUTES = 30;
const FALLBACK_WARNING_SECONDS = 60;

const parsePositiveInt = (raw, fallback) => {
    const parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const DEFAULT_IDLE_TIMEOUT_MS =
    parsePositiveInt(process.env.REACT_APP_IDLE_TIMEOUT_MIN, FALLBACK_IDLE_MINUTES) *
    60 *
    1000;

const DEFAULT_WARNING_BEFORE_MS =
    parsePositiveInt(process.env.REACT_APP_SESSION_WARNING_SEC, FALLBACK_WARNING_SECONDS) *
    1000;

const SessionTimeoutModal = ({
    idleTimeMs = DEFAULT_IDLE_TIMEOUT_MS,
    warningBeforeMs = DEFAULT_WARNING_BEFORE_MS,
}) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleExpire = useCallback(() => {
        logout();
        navigate("/login", { replace: true });
    }, [logout, navigate]);

    const { isWarning, secondsLeft, extendSession } = useSessionTimeout({
        idleTimeMs,
        warningBeforeMs,
        onExpire: handleExpire,
    });

    if (!isWarning) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
                <div className="flex items-start gap-3 border-b border-gray-100 px-5 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-50 text-yellow-600">
                        <AlertTriangle size={20} strokeWidth={1.8} />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            Session about to expire
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                            You've been inactive. Save your work before you're signed out.
                        </p>
                    </div>
                </div>

                <div className="px-5 py-5">
                    <p className="text-sm leading-6 text-gray-700">
                        You will be logged out in{" "}
                        <span className="font-semibold text-gray-900">{secondsLeft}</span>{" "}
                        second{secondsLeft === 1 ? "" : "s"}. Continue working or log out
                        now.
                    </p>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 px-5 py-4">
                    <button
                        type="button"
                        onClick={handleExpire}
                        className="rounded-md border border-gray-200 px-5 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                    >
                        Log out
                    </button>

                    <button
                        type="button"
                        onClick={extendSession}
                        className="rounded-md bg-emerald-600 px-5 py-2 text-xs font-medium text-white hover:bg-emerald-700"
                    >
                        Continue session
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionTimeoutModal;
