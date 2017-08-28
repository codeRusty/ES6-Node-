export default class NResponses {
    constructor(success, statusCode, data, message) {
        this.success = success;
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }

    Objectify() {
        return {
            "success": this.success,
            "statusCode": this.statusCode,
            "data": this.data,
            "message": this.message
        }
    }
}