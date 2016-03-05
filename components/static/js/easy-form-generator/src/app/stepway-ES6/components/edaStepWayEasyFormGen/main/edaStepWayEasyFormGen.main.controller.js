/* global angular */
import {
	initDebugModel,
	initTabModel,
	initColumnTemplate,
	initLineTemplate
} from './edaStepWayEasyFormGen.main.controller.helpers';

import editControlModalTemplate from '../modal/edaStepWayEasyFormGen.editControlModal.template.html!text';

import {
	EDIT_MODAL_CONTROLLER_NAME
} from '../modal/edaStepWayEasyFormGen.editControlModal.controller';

const STEP_WAY_MAIN_CONTROLLER_NAME = 'edaStepWayEasyFormGenController';
const STEP_WAY_MAIN_CONTROLLERAS_NAME = 'vm';

class edaStepWayEasyFormGenController {
		
	constructor	(easyFormGenVersion,
							$filter,
							toaster,
							$timeout, 
							$modal,
							$log, 
							formFieldManage,  
							controllerModalProxy,
							easyFormSteWayConfig){
														
		this.easyFormGenVersion = easyFormGenVersion;
		this.$filter = $filter;
		this.toaster = toaster;
		this.$timeout = $timeout;
		this.$modal = $modal;
		this.$log = $log;
		this.formFieldManage = formFieldManage;
		this.controllerModalProxy = controllerModalProxy;
		this.easyFormSteWayConfig = easyFormSteWayConfig;
		
		this.init();
			
	}
	
	init() {
		
		this.model                 = {};
		this.wfFormFields          = [];
		this.wfFormFieldsOnlyNeededProperties = []; 
		this.easyFormGeneratorVERSION = this.easyFormGenVersion;
		this.debug                    = initDebugModel();
		this.tab                      = initTabModel();
		this.configuration            = {};//configuration model (contains array of lines which contains array of columns)    											
		this.numberOfColumns          = 1;
		this.MaxNumberOfColumns       = 3;
		this.MinNumberOfColumns       = 1;		
		this.columnTemplate           = initColumnTemplate(); //TODO : check is really needed 
		this.lineTemplate             = initLineTemplate();   //TODO : check if really needed
		this.nyaSelect              	= {};  
		this.animationsEnabled        = this.easyFormSteWayConfig.getModalAnimationValue();  //-> disabling animation untill correction in angular bootstrap
		this.editControlModalSize			= 'lg';
		this.formlyList               = {};
		this.previewLoadedForm        = { fieldsModel:[] };
		this.configurationLoaded      = {};
		this.returnSaveEvent          = false;   		
		//this.resetToZeroModel         = resetToZeroModel; //function no more used
		
		this.formFieldManage.initConfigurationEditFromScratch(this.configuration);	
		this.controllerModalProxy.initNyaSelect(this.nyaSelect);
		
	}
	
	onSubmit() {
		let JSONedModel = this.$filter('json')(this.model, 4);
		this.toaster.pop({
				type 		: 'info',
				timeout : 2000,
				title 	: `it should save data model if it were not in editor`,
				body 		: `data : ${JSONedModel}`,                
				showCloseButton: true
		}); 		
	}
	
	countConfigurationModelLines() {
		this.debug.configurationModelNumberofLines = this.configuration.lines.length;
		return this.configuration.lines.length;		
	}
	
	setActiveLineNumber(lineNumber) {
		if (lineNumber <= this.countConfigurationModelLines()) {
			this.configuration.activeLine = lineNumber;
		}		
	}
	
	upThisLine(indexLine) {
		if (indexLine > -1) {
			if (this.configuration.lines[indexLine - 1]) {
				var currentLineObj = this.configuration.lines[indexLine];
				this.configuration.lines.splice(indexLine , 1);
				this.configuration.lines.splice((indexLine - 1), 0, currentLineObj);    
				//manage selected aciveLine
				this.configuration.activeLine = 1;
			}
		}
			//re-render formfield 
		this.formFieldManage.applyConfigurationToformlyModel(this.configuration, this.wfFormFields, this.model);
		this.wfFormFieldsOnlyNeededProperties = angular.copy(this.wfFormFields);		
	}
	
	downThisLine(indexLine) {
		if (indexLine > -1) {
			if (this.configuration.lines[indexLine + 1]) {
				var currentLineObj = this.configuration.lines[indexLine];
				this.configuration.lines.splice(indexLine , 1);
				this.configuration.lines.splice((indexLine + 1), 0, currentLineObj);  
				//manage selected aciveLine
				this.configuration.activeLine = 1;
			}
		}     
		//re-render formfield 
		this.formFieldManage.applyConfigurationToformlyModel(this.configuration, this.wfFormFields, this.model); 
		this.wfFormFieldsOnlyNeededProperties = angular.copy(this.wfFormFields);		
	}
	
	addNewline() {
		this.configuration.lines.push(initLineTemplate());
			//re-render formfield 
		this.formFieldManage.applyConfigurationToformlyModel(this.configuration, this.wfFormFields, this.model);
		this.wfFormFieldsOnlyNeededProperties = angular.copy(this.wfFormFields);		
	} 
	
	removeThisLine(index) {
		if (index > -1) {
			if (this.configuration.lines.length > 1) {
					//manage selected aciveLine
					if (this.configuration.activeLine === index + 1) {
						this.configuration.activeLine = 1;
					}
					this.configuration.lines.splice(index, 1);
			}else{
				this.$timeout(function(){
						this.toaster.pop({
										type: 'warning',
										title: 'Last line' ,
										body: 'Can\'t delete the last line',                
										showCloseButton: true
							});
				}, 100); 
			}
		//re-render formfield 
		this.formFieldManage.applyConfigurationToformlyModel(this.configuration, this.wfFormFields, this.model);
		this.wfFormFieldsOnlyNeededProperties = angular.copy(this.wfFormFields);
		}
	}
	
	
	increaseNumberOfColumns() {
		if (this
					.configuration
					.lines[this.configuration.activeLine -1]
					.columns.length < this.MaxNumberOfColumns) {
	
			var newNumberOfColumns = this
																	.configuration
																	.lines[this.configuration.activeLine -1]
																	.columns
																	.push(initColumnTemplate());
			this
					.configuration
					.lines[this.configuration.activeLine -1]
					.columns[newNumberOfColumns - 1]
					.numColumn = newNumberOfColumns; 
			}
				//re-render formfield 
			this.formFieldManage.applyConfigurationToformlyModel(this.configuration, this.wfFormFields, this.model); 
			this.wfFormFieldsOnlyNeededProperties = angular.copy(this.wfFormFields);
	}
	
	
	decreaseNumberOfColumns() {
		if (this
					.configuration
					.lines[this.configuration.activeLine -1]
					.columns.length > 1) {
			this.configuration
				.lines[this.configuration.activeLine -1]
				.columns
				.splice(this.configuration.lines[this.configuration.activeLine -1].columns.length -1, 1);
		}
		this.formFieldManage.applyConfigurationToformlyModel(this.configuration, this.wfFormFields, this.model);  
		this.wfFormFieldsOnlyNeededProperties = angular.copy(this.wfFormFields);  
	}
	
	
	resetStepCounter() {
		this.configuration.configStepCounter = 0;
	} 
	
	
	nextConfigStep() {
		var configStepCounterMAX = this.configuration.listConfigStep.length -1;
		if (this.configuration.configStepCounter !== configStepCounterMAX) {
				this.configuration.configStepCounter ++;
		}    
		this.setTrueThisStepIndicator(this.configuration.configStepCounter);
	}
	
	
	resetAllIndicators(){
		for (var i = this.configuration.stepIndicators.length - 1; i >= 0; i--) {
			this.configuration.stepIndicators[i] = false;
		}
	}
	
	
	setTrueThisStepIndicator(indexIndicator){
			this.resetAllIndicators();
			this.configuration.stepIndicators[indexIndicator] = true;    
	}

	
	previousConfigStep() {
		if (this.configuration.configStepCounter !== 0) {
			this.configuration.configStepCounter --;
		}
		this.setTrueThisStepIndicator(this.configuration.configStepCounter);
	}
	
	
	stepReachable(indexStep) {
		if (indexStep < this.configuration.configStepCounter) {
			return 'disabled';
		}else{
			return 'enabled';
		}
	}
	
	showModalAddCtrlToColumn(size, indexLine, numcolumn) {
	
		var modalInstance = this.$modal.open({
																			animation		: this.animationsEnabled,
																			template		: editControlModalTemplate,  
																			controller	: EDIT_MODAL_CONTROLLER_NAME,
																			size				: this.editControlModalSize,
																			resolve			: {
																				nyaSelect : function () {
																					return this.controllerModalProxy
																										.getNyASelectFromSelectedLineColumn(this.nyaSelect, this.configuration,indexLine, numcolumn);
																				}
																			}
		});
	
		modalInstance.result.then(function (modalAddCtrlModel) {
				this.controllerModalProxy.bindConfigurationModelFromModalReturn(indexLine, numcolumn, modalAddCtrlModel, this.configuration);
				this.formFieldManage.applyConfigurationToformlyModel(this.configuration, this.wfFormFields, this.model);
				this.wfFormFieldsOnlyNeededProperties = angular.copy(this.wfFormFields);
	
		}, function () {
			//$log.info('Modal dismissed at: ' + new Date());
		});
	}
	
	previewExistingform(formlyform) {
		let configlines = JSON.parse(formlyform.formlyField);
		//here to replace with $scope.configuration : initialise configuration with lines 
		this.configurationLoaded = {};
		this.formFieldManage.bindConfigurationLines(this.configurationLoaded,configlines);
		this.formFieldManage.applyConfigurationToformlyModel(this.configurationLoaded, this.previewLoadedForm.fieldsModel, $scope.vm.model);
		this.wfFormFieldsOnlyNeededProperties = angular.copy(this.wfFormFields);
		this.previewLoadedForm.cancelButtonText = formlyform.cancelButtonText;
		this.previewLoadedForm.submitButtonText = formlyform.submitButtonText;
	} 	 
	
	
	saveThisForm() {
		if (typeof this.configuration.formName === 'undefined') {
		this.toaster.pop({
						type: 'warning',
						timeout:2000,
						title: 'Form name is undefined',
						body: 'Form has not been saved.',                
						showCloseButton: true
			});
			return false;
		}
		if (this.configuration.formName === '') {
		this.toaster.pop({
						type: 'warning',
						timeout:2000,
						title: 'Form name is required',
						body: 'Form has not been saved.',                
						showCloseButton: true
			});
			return false;
		}
		this.toaster.pop({
						type: 'wait',
						timeout:10000,
						title: 'Form is being saved',
						body: 'Wait.',                
						showCloseButton: true
		});
		this.toaster.clear();  
		this.returnSaveEvent = true;
		return true;
	} 	 		 	 		 	
	
	
	
}


const toInject = [
	"$scope", 
	'easyFormGenVersion',
	'$filter',
	'toaster', 
	'$timeout',
	'$modal',
	'$log', 
	'formFieldManage',
	'controllerModalProxy',
	'easyFormSteWayConfig'	
];

edaStepWayEasyFormGenController.$inject = toInject;
export default edaStepWayEasyFormGenController;
export {STEP_WAY_MAIN_CONTROLLER_NAME, STEP_WAY_MAIN_CONTROLLERAS_NAME}