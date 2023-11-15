export class EmailIsAlreadyInUseError extends Error {
  constructor() {
    super('This email is already in use.');
  }
}
