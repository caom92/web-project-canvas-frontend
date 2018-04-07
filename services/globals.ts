export abstract class GlobalMembersService {

  private _isSpinnerVisible = true
  private _hasSideNav = false
  private _makeSpaceForSideNav = false

  constructor(
    protected readonly navBarColor = 'koi-orange',
    protected readonly isContentCentered = true,
    protected readonly isSideNavFixed = true
  ) {
  }

  get hasSideNav(): boolean {
    return this._hasSideNav
  }

  get isSpinnerVisible(): boolean {
    return this._isSpinnerVisible
  }

  get makeSpaceForSideNav(): boolean {
    return this._makeSpaceForSideNav
  }

  showSideNav(): void {
    this._hasSideNav = true
    if (this.isSideNavFixed) {
      this._makeSpaceForSideNav = true
    }
  }

  hideSideNav(): void {
    this._hasSideNav = false
    if (this.isSideNavFixed) {
      this._makeSpaceForSideNav = false
    }
  }

  showSpinner(): void {
    this._isSpinnerVisible = true
  }

  hideSpinner(): void {
    this._isSpinnerVisible = false
  }
}
