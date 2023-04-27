import { createApp } from "./vue.esm-browser.prod.js";
createApp({
    data() {
        return {
            timers: {
                main: {
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    intervalID: null,
                    timeovered: false,
                    timerClassName: "main-timer",
                    transparency: 50,
                    color: "#ffffff",
                },
                sub1: {
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    intervalID: null,
                    timeovered: false,
                    timerClassName: "sub1-timer",
                    label: "",
                },
            },
        };
    },
    methods: {
        startTimer(timer) {
            const self = this;
            timer.intervalID = setInterval(() => {
                timer.seconds--;
                if (timer.seconds < 0) {
                    timer.minutes--;
                    timer.seconds = 59;
                }
                if (timer.minutes < 0) {
                    timer.hours--;
                    timer.minutes = 59;
                }
                if (timer.hours < 0) {
                    timer.hours = 0;
                    timer.minutes = 0;
                    timer.seconds = 1;
                    self.clearCurrentInterval(timer);
                    timer.timeovered = true;
                    self.overTimer(timer);
                }
            }, 1000);
        },
        toggleTimer(timer) {
            const self = this;
            if (timer.intervalID) {
                self.clearCurrentInterval(timer);
            } else {
                timer.timeovered ? self.overTimer(timer) : self.startTimer(timer);
            }
        },
        clearTimer(timer) {
            const self = this;
            timer.hours = 0;
            timer.minutes = 0;
            timer.seconds = 0;
            self.clearCurrentInterval(timer);
            timer.timeovered = false;
        },
        overTimer(timer) {
            timer.intervalID = setInterval(() => {
                timer.seconds++;
                if (timer.seconds > 59) {
                    timer.minutes++;
                    timer.seconds = 0;
                }
                if (timer.minutes > 59) {
                    timer.hours++;
                    timer.minutes = 0;
                }
            }, 1000);
        },
        clearCurrentInterval(timer) {
            clearInterval(timer.intervalID);
            timer.intervalID = null;
        },
        toggleShowSettings() {
            const settings = document.querySelector(".settings");
            settings.classList.toggle("show");
            const settingsBackground = document.querySelector(".settings-background");
            settingsBackground.classList.toggle("show");
        },
        validateTime(timer) {
            if (timer.seconds > 59) {
                timer.seconds = 59;
            } else if (timer.seconds < 0) {
                timer.seconds = 0;
            }
            if (timer.minutes > 59) {
                timer.minutes = 59;
            } else if (timer.minutes < 0) {
                timer.minutes = 0;
            }
            if (timer.hours > 99) {
                timer.hours = 99;
            } else if (timer.hours < 0) {
                timer.hours = 0;
            }
        },
        validateTimeNull(timer) {
            if (!timer.seconds) {
                timer.seconds = 0;
            }
            if (!timer.minutes) {
                timer.minutes = 0;
            }
            if (!timer.hours) {
                timer.hours = 0;
            }
        },
        handleTimeovered(timer) {
            if (timer.timeovered) {
                const timerElement = document.querySelector(`.${timer.timerClassName}`);
                timerElement.classList.add("over");
            } else {
                const timerElement = document.querySelector(`.${timer.timerClassName}`);
                timerElement.classList.remove("over");
            }
        },
        onBackgroundImageFileChange(e) {
            const file = e.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                document.querySelector("body").style.backgroundImage = `url(${url})`;
                localStorage.setItem("bgimage", url);
            }
        },
        clearBackgroundImage() {
            document.querySelector("body").style.backgroundImage = "";
            localStorage.removeItem("bgimage");
        }
    },
    watch: {
        "timers.main": {
            handler() {
                this.validateTime(this.timers.main);
                this.handleTimeovered(this.timers.main);
        },
            deep: true,
        },
        "timers.sub1": {
            handler() {
                this.validateTime(this.timers.sub1);
                this.handleTimeovered(this.timers.sub1);
            },
            deep: true,
        },
    },
    mounted() {
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.toggleShowSettings();
            }
        });
        if (localStorage.getItem("bgimage")) {
            document.querySelector("body").style.backgroundImage = `url(${localStorage.getItem("bgimage")})`;
        }
    },
}).mount("#app");
