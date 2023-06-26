import EventEmitter3 from "eventemitter3";

export class EventEmitter {
  eventEmitter = new EventEmitter3();

  resize() {
    //이벤트 발생
    this.eventEmitter.emit("resize");
  }

  onResize(callbackFn) {
    //이벤트 생성
    this.eventEmitter.on("resize", callbackFn);
  }
}

export const SEventEmitter = new EventEmitter();
