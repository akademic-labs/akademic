import { ValidatorService } from "./../../../services/validator.service";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

import { States } from "app/models/states.interface";
import { Cities } from "app/models/cities.interface";
import { Activity } from "app/models/activity.interface";
import { ActivityType } from "app/models/activity-type.interface";

import { ActivityService } from "app/services/activity.service";
import { ActivityTypeService } from "app/services/activity-type.service";
import { Observable } from "rxjs";

// import { UploadPageComponent } from "app/uploads/upload-page/upload-page.component";
import { NotifyService } from "../../../services/notify.service";
import { Attachment } from "../../../models/attachment.interface";
import { AngularFireUploadTask, AngularFireStorage } from "angularfire2/storage";

@Component({
  selector: "aka-input-activity",
  templateUrl: "./input-activity.component.html",
  styleUrls: ["./input-activity.component.css"]
})
export class InputActivityComponent implements OnInit {
  // @ViewChild(UploadPageComponent) fileUpload: UploadPageComponent;

  title = "Entrada de Atividade";
  activity: Activity;
  activityForm: FormGroup;
  $activityTypes: Observable<ActivityType[]>;
  $states: Observable<States[]>;
  $cities: Observable<Cities[]>;
  disabledSave: boolean;
  @ViewChild("inputFocus") focusIn: ElementRef;

  // UPLOAD ATTACH
  // Main task
  task: AngularFireUploadTask;
  // Progress monitoring
  percentage: Observable<number>;
  snapshot: Observable<any>;
  // State for dropzone CSS toggling
  isHovering: boolean;
  attach: Attachment;
  imageUrl = null;

  constructor(
    private fb: FormBuilder,
    public _actService: ActivityService,
    private _actTypesService: ActivityTypeService,
    private _http: HttpClient,
    private _notify: NotifyService,
    private validatorService: ValidatorService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.buildForm();
    this.$activityTypes = this._actTypesService.get();
    this.getStates();
    this.focusIn.nativeElement.focus();
  }

  getStates() {
    this.$states = this._http.get<States[]>(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
    );
  }

  getCities() {
    const state = this.activityForm.get("state").value;
    this.$cities = this._http.get<Cities[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${
        state.id
      }/municipios`
    );
  }

  buildForm() {
    this.activityForm = this.fb.group({
      initialDate: ["", Validators.required],
      finalDate: ["", Validators.required],
      createdAt: [new Date().toISOString().split("T")[0]],
      description: ["", Validators.required],
      hoursDuration: ["", Validators.required],
      local: ["", Validators.required],
      city: ["", Validators.required],
      state: ["", Validators.required],
      schoolYear: ["", Validators.required],
      semester: ["", Validators.required],
      observation: [""],
      activityType: ["", Validators.required],
      attach: ["", Validators.required]
    });
  }

  onSubmit(upload) {
    if (this.activityForm.valid) {
      this.task = this.storage.upload(this.path, this.file);
      this._actService
        .createActivity(this.activityForm.value, this.attach)
        .then(result => {
          console.log(result);
          this.activityForm.reset();
          this.imageUrl = null;
          this.focusIn.nativeElement.focus();
        });
    } else {
      this.validatorService.checkOut(this.activityForm);
      this.disabledSave = true;
      this._notify.update("danger", "Campos obrigatórios não preenchidos!");
    }
  }

  //method definition in your class
  renderAttach(event: FileList) {
    let reader = new FileReader();
    //get the selected file from event
    // let file = e.target.files[0];
    const file = event.item(0);
    reader.onloadend = () => {
      //Assign the result to variable for setting the src of image element
      this.imageUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  path;
  customMetadata;
  file;

  removeAttach(){
    this.imageUrl = null;
  }

  startAttach(event: FileList) {
    this.renderAttach(event);
    // The File object
    this.file = event.item(0);

    // Client-side validation example
    if (this.file.type.split("/")[0] !== "image") {
      this._notify.update("warning", "Arquivo não suportado.");
      return;
    }

    // The storage path
    this.path = `activities-attach/${new Date().getTime()}-${this.file.name}`;

    // Totally optional metadata
    const customMetadata = { app: "atividade-complementar!" };

    // The main task
    // this.task = this.storage.upload(path, file, { customMetadata });
    // this.task = this.storage.upload(this.path, this.file);

    this.attach = { name: this.file.name, type: this.file.type, url: this.path };

    // Progress monitoring
    // this.percentage = this.task.percentageChanges();
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return (
      snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
    );
  }
}
