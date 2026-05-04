export type createFeedbackMessageDto = {
    name:string;
    phone:string;
    message:string;
    location:string;
    department:string;
};

export type CreateFeedbackMessageApiResp = {
    status: string;
}