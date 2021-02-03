import Appointment from '@models/Appointment';
import ICacheProvider from '@providers/cache/ICacheProvider';
import IAppointmentRepository from '@repositories/IAppointmentRepository';
import { classToClass } from 'class-transformer';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  providerId: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentRepository')
    private appointmentsRepository: IAppointmentRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) { }

  public async execute({
    providerId,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${providerId}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.recovery<Appointment[]>(
      cacheKey,
    );

    if (!appointments) {
      appointments = classToClass(
        await this.appointmentsRepository.findAllInDay({
          providerId,
          day,
          month,
          year,
        }),
      );

      await this.cacheProvider.save(cacheKey, appointments);
    }

    return appointments;
  }
}

export default ListProviderAppointmentsService;
