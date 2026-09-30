import { Router }                   from 'express';
import { AnonymousAccessRoutes }    from './anonymousAcess/routes'; 

export const AccessIdentificationRoutes = Router(); 

AccessIdentificationRoutes.use('/anonymous', AnonymousAccessRoutes);
