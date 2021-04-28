import { Injectable } from '@angular/core';
import { Dominio } from '~app/models/dominio';
import { User } from '~app/models/user';

@Injectable()
export class ContextService {
  constructor() { }

  getDominio(): Dominio {
    try {
      return JSON.parse(localStorage.getItem('dominio'));
    } catch {
      return null;
    }
  }

  setDominio(dominio:Dominio): void {
    localStorage.setItem('dominio', JSON.stringify(dominio));
  }

  // usuario activo

  getUserNameIndividual(): string {
    try {
      return localStorage.getItem('userNameIndividual');
    } catch {
      return null;
    }
  }

  setUserNameIndividual(userName: string): void {
    localStorage.setItem('userNameIndividual', userName);
  }

  getUserNameOrganizacion(): string {
    try {
      return localStorage.getItem('userNameOrganizacion');
    } catch {
      return null;
    }
  }

  setUserNameOrganizacion(userName: string): void {
    localStorage.setItem('userNameOrganizacion', userName);
  }

  // tratamiento común de los token
  public removeTokenFormio() {
    this.removeTokenFormioIndividual();
    this.removeTokenFormioOrganizacion();
  }

  // token de usuario individual y usuario individual
  getTokenFormioIndividual(): string {
    return localStorage.getItem('tokenFormioIndividual')
  }

  public setTokenFormioIndividual(token: string): void {
    localStorage.setItem('tokenFormioIndividual', token);
  }

  public removeTokenFormioIndividual(): void {
    localStorage.removeItem('tokenFormioIndividual');
  }

  getUserFormioIndividual(): User {
    try {
      return JSON.parse(localStorage.getItem('userFormioIndividual'));
    } catch {
      return null;
    }
  }

  public setUserFormioIndividual(user: User): void {
    try {
      localStorage.setItem('userFormioIndividual', JSON.stringify(user));
    } catch {
      this.removeUserFormioIndividual();
    }
  }

  public removeUserFormioIndividual(): void {
    localStorage.removeItem('userFormioIndividual');
  }

  // token de organizacion y usuario organización
  getTokenFormioOrganizacion(): string {
    return localStorage.getItem('tokenFormioOrganizacion')
  }

  public setTokenFormioOrganizacion(token: string): void {
    localStorage.setItem('tokenFormioOrganizacion', token);
  }

  public removeTokenFormioOrganizacion(): void {
    localStorage.removeItem('tokenFormioOrganizacion');
  }

  getUserFormioOrganizacion(): User {
    try {
      return JSON.parse(localStorage.getItem('userFormioOrganizacion'));
    } catch {
      return null;
    }
  }

  public setUserFormioOrganizacion(user: User): void {
    try {
      localStorage.setItem('userFormioOrganizacion', JSON.stringify(user));
    } catch {
      this.removeUserFormioOrganizacion();
    }
  }

  public removeUserFormioOrganizacion(): void {
    localStorage.removeItem('userFormioOrganizacion');
  }
}
