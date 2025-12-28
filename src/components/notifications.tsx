// @ts-types="solid-js"
import { createSignal } from "solid-js";

class notifications {
    private msgSignals = createSignal('');
    private showSignals = createSignal(false);

    public newNotification(msg: string) {
        const [_show, setShow] = this.showSignals;
        const [_msg, setText] = this.msgSignals;
        setText(msg);
        setShow(true);
        
        setTimeout(() => {
            setShow(false)
        }, 3000);
    }

    public Content() {
        const [show, _setShow] = this.showSignals;
        const [msg, _setText] = this.msgSignals;
        
        return (
            <div class="fixed top-0 origin-top-right place-self-end z-9 m-[1%] px-2 py-1 max-w-60 rounded-md 
            bg-gray-600 text-stone-400 text-lg shadow-md shadow-black/35 
            transition-discrete delay-75 duration-100 ease-in"
            classList={{
                'opacity-100' : show(),
                'opacity-0' : !(show())
            }}
            >
                {msg()}
            </div>
        )
    }
}

export const [toast, setToast] = createSignal(new notifications())