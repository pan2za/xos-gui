// TODO clean this mess

import * as _ from 'lodash';
import {IXosFormHelpersService} from './form-helpers';
import {IXosConfigHelpersService} from '../services/helpers/config.helpers';

export interface IXosFormAction {
  label: string;
  icon: string;
  class: string;
  cb(item: any, form: any): void;
}

export interface IXosFeedback {
  show: boolean;
  message: string;
  type: string; // NOTE is possible to enumerate success, error, warning, info?
  autoHide?: number;
  closeBtn?: boolean;
}

export interface IXosFormInputValidator {
  minlength?: number;
  maxlength?: number;
  required?: boolean;
  min?: number;
  max?: number;
  custom?(value: any): any;
    // do your validation here and return true | false
    // alternatively you can return an array [errorName, true|false]
}

export interface IXosFormInputOptions {
  id: number;
  label: string;
}

export interface IXosFormInput {
  name: string;
  label: string;
  type: string; // options are: [date, boolean, number, email, string, select],
  hint?: string;
  validators: IXosFormInputValidator;
  options?: IXosFormInputOptions[];
}

export interface IXosFormCfg {
  exclude?: string[];
  actions: IXosFormAction[];
  feedback?: IXosFeedback;
  inputs: IXosFormInput[];
  formName: string;
}

class FormCtrl {
  $inject = ['$onInit', '$scope', 'XosFormHelpers', 'ConfigHelpers'];

  public ngModel: any;
  public excludedField: string[];
  public formField: any;
  private config: any;

  constructor (
    private $scope: ng.IScope,
    private XosFormHelpers: IXosFormHelpersService,
    private ConfigHelpers: IXosConfigHelpersService
  ) {
  }

  $onInit() {
    if (!this.config) {
      throw new Error('[xosForm] Please provide a configuration via the "config" attribute');
    }

    if (!this.config.actions) {
      throw new Error('[xosForm] Please provide an action list in the configuration');
    }

    if (!this.config.formName) {
      throw new Error('[xosForm] Please provide a formName property in the config');
    }

    // NOTE needed to avoid xosAlert throw an error
    if (!this.config.feedback) {
      this.config.feedback =  {
        show: false,
        message: 'Form submitted successfully !!!',
        type: 'success',
        closeBtn: true
      };
    }

    // remove excluded inputs
    _.remove(this.config.inputs, i => this.config.exclude.indexOf(i.name) > -1);
  }
}

export const xosForm: angular.IComponentOptions = {
  template: require('./form.html'),
  controllerAs: 'vm',
  controller: FormCtrl,
  bindings: {
    ngModel: '=',
    config: '='
  }
};
