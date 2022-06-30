import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { BehaviorSubject, fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { filter, skip, switchMap, take, takeUntil, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'inline-edit',
  templateUrl: './inline-edit.component.html',
  styleUrls: ['./inline-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineEditComponent implements OnInit, OnDestroy {
  @Input() private editType: string;
  @Input() private modelValue: any;

  @Input() public comboData: any[];
  @Input() public comboValue: any;
  @Input() public comboText: any;

  @Output() private onInlineEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output() private onEnterEditMode: EventEmitter<any> = new EventEmitter<void>();
  @Output() private onLeaveEditMode: EventEmitter<any> = new EventEmitter<void>();

  private editMode: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public editMode$: Observable<boolean> = this.editMode.asObservable();

  public localModel: any;
  public isEditing: boolean = false;
  public viewHandler: Subscription;
  public editHandler: Subscription;

  constructor(private elRef: ElementRef) { }

  ngOnInit(): void {
    this.handleViewMode();
    this.handleEditMode();
  }

  private get element(): any {
    return this.elRef.nativeElement;
  }

  private handleViewMode(): void {
    this.viewHandler = fromEvent(this.element, 'click')
      .pipe(
        withLatestFrom(this.editMode$),
        filter(([_, editMode]) => !editMode),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.displayEditMode());
  }

  private handleEditMode(): void {
    const clickOutside$ = (editMode: boolean) =>
      fromEvent(document, 'click').pipe(
        filter(() => this.isEditing === false),
        filter(() => editMode),
        skip(1),
        filter(({ target }) => this.element.contains(target) === false),
        take(1)
      );


    this.editHandler = this.editMode$
      .pipe(
        switchMap((editMode: boolean) => clickOutside$(editMode)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.leaveEditMode());
  }

  private displayEditMode(): void {
    this.editMode.next(true);
    this.onEnterEditMode.emit();

    this.localModel = this.modelValue;
  }

  private leaveEditMode(): void {
    this.editMode.next(false);
    this.onLeaveEditMode.emit();

    this.viewHandler.unsubscribe();
    setTimeout(() => this.handleViewMode(), 0);
  }

  public saveEdit(): void {
    this.onInlineEdit.emit(this.localModel);
    
    this.leaveEditMode();
  }
  
  public openedChange(): void {
    setTimeout(() => this.isEditing === true ? this.isEditing = false : null)
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
