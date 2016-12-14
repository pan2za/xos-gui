// TODO fininsh to import all methods from https://github.com/opencord/ng-xos-lib/blob/master/src/ui_components/dumbComponents/table/table.component.js
// TODO import tests

import './table.scss';
import * as _ from 'lodash';

interface IXosTableCgfOrder {
  reverse: boolean;
  field: string;
}

export interface IXosTableCfg {
  columns: any[];
  order: IXosTableCgfOrder; // | boolean;
}

class TableCtrl {
  $inject = ['$onInit'];

  public columns: any[];
  public orderBy: string;
  public reverse: boolean;
  private config: IXosTableCfg;


  $onInit() {
    if (!this.config) {
      throw new Error('[xosTable] Please provide a configuration via the "config" attribute');
    }

    if (!this.config.columns) {
      throw new Error('[xosTable] Please provide a columns list in the configuration');
    }

    // handle default ordering
    if (this.config.order && angular.isObject(this.config.order)) {
      this.reverse = this.config.order.reverse || false;
      this.orderBy = this.config.order.field || 'id';
    }

    // if columns with type 'custom' are provided
    // check that a custom formatter is provided too
    let customCols = _.filter(this.config.columns, {type: 'custom'});
    if (angular.isArray(customCols) && customCols.length > 0) {
      _.forEach(customCols, (col) => {
        if (!col.formatter || !angular.isFunction(col.formatter)) {
          throw new Error('[xosTable] You have provided a custom field type, a formatter function should provided too.');
        }
      });
    }

    // if columns with type 'icon' are provided
    // check that a custom formatter is provided too
    let iconCols = _.filter(this.config.columns, {type: 'icon'});
    if (angular.isArray(iconCols) && iconCols.length > 0) {
      _.forEach(iconCols, (col) => {
        if (!col.formatter || !angular.isFunction(col.formatter)) {
          throw new Error('[xosTable] You have provided an icon field type, a formatter function should provided too.');
        }
      });
    }

    // if a link property is passed,
    // it should be a function
    let linkedColumns = _.filter(this.config.columns, col => angular.isDefined(col.link));
    if (angular.isArray(linkedColumns) && linkedColumns.length > 0) {
      _.forEach(linkedColumns, (col) => {
        if (!angular.isFunction(col.link)) {
          throw new Error('[xosTable] The link property should be a function.');
        }
      });
    }

    this.columns = this.config.columns;

  }
}

export const xosTable: angular.IComponentOptions = {
  template: require('./table.html'),
  controllerAs: 'vm',
  controller: TableCtrl,
  bindings: {
    data: '=',
    config: '='
  }
};