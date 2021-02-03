import Notification from '@models/Notification';
import INotificationsRepository from '@repositories/INotificationsRepository';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  recipientId: string;
  content: string;
}

@injectable()
class CreateNotificationService {
  constructor(
    @inject('NotificationRepository')
    private notificationRepository: INotificationsRepository,
  ) { }

  public execute({ recipientId, content }: IRequest): Promise<Notification> {
    return this.notificationRepository.create({ recipientId, content });
  }
}

export default CreateNotificationService;
