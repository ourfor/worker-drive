import { HTTPRequestHandler } from "@task/HTTPRequestHandler"
import { BeanType, Provider } from "@service/Provider"
import { TimeService } from "@service/TimeService"
import { WebService } from "@service/WebService"
import { RefreshOneDriveToken } from "@task/RefreshOneDriveToken"

const server = Provider<WebService>(BeanType.HTTP_SERVER)!
server.start(HTTPRequestHandler)

const timer = Provider<TimeService>(BeanType.TIME)!
timer.start(RefreshOneDriveToken)