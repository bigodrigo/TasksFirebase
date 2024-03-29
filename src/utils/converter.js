//User converter
  //Vamos criar uma classe para enviar as infos da pessoa!
  export class User {
    constructor (email, name, uid, ) {
      this.email = email;
      this.name = name;
      this.uid = uid;
    }
    toString() {
      return this.email + ',' + this.name + ',' + this.uid;
    }
  }
  //Agora um conversor do FB para as infos do User
  export const userConverter = {
    toFirestore: (user) => {
        return {
          email: user.email,
          name: user.name,
          uid: user.uid,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.email, data.name, data.uid);
    }
};
//Tasks converter
  export class TaskFB {
    constructor (content, date, id, isFinished, ) {
      this.content = content;
      this.date = date;
      this.id = id;
      this.isFinished = isFinished;
    }
    toString() {
      return this.content + ',' + this.date + ',' + this.id + ',' + this.isFinished;
    }
  }
  //Agora um conversor do FB para as infos do User
  export const taskConverter = {
    toFirestore: (task) => {
        return {
          content: task.content,
          date: task.date,
          id: task.id,
          isFinished: task.isFinished,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new TaskFB(data.content, data.date, data.id, data.isFinished);
    }
};