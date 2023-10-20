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

  lose() {
    this.eventEmitter.emit("lose");
  }

  onLose(callbackFn) {
    this.eventEmitter.on("lose", callbackFn);
  }

  enter() {
    this.eventEmitter.emit("enter");
  }

  onEnter(callbackFn) {
    this.eventEmitter.on("enter", callbackFn);
  }

  changeScene(scene) {
    this.eventEmitter.emit("changeScene", scene);
  }

  onChangeScene(callbackFn) {
    this.eventEmitter.on("changeScene", callbackFn);
  }
}

export const SEventEmitter = new EventEmitter();
