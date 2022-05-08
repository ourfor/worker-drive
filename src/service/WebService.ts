export type HTTPHandler = (req: Request) => Promise<Response>
export interface WebService {
    start: (handler: HTTPHandler) => void;
}