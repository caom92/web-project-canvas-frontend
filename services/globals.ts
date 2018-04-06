export abstract class GlobalMembersService {

  private _isSpinnerVisible = true
  private _isSideNavVisible = false

  constructor(
    protected readonly navBarColor: string = 'koi-orange',
    protected readonly isContentCentered: boolean = true
  ) {
  }

  get isSideNavVisible(): boolean {
    return this._isSideNavVisible
  }

  get isSpinnerVisible(): boolean {
    return this._isSpinnerVisible
  }

  showSideNav(): void {
    this._isSideNavVisible = true
  }

  hideSideNav(): void {
    this._isSideNavVisible = false
  }

  showSpinner(): void {
    this._isSpinnerVisible = true
  }

  hideSpinner(): void {
    this._isSpinnerVisible = false
  }
}
