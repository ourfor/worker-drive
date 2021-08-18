import { HttpStatus } from "@src/enum"

export class Exception {
  status: number = 200
  statusText: string = ""
  reason: string = ""
}

export class UnauthorizedException extends Exception {
  constructor(reason: string) {
    super()
    this.status = HttpStatus.Unauthorized
    this.statusText = 'Unauthorized'
    this.reason = reason
  }
}

export class BadRequestException extends Exception {
  constructor(reason: string) {
    super()
    this.status = 400
    this.statusText = 'Bad Request'
    this.reason = reason
  }
}