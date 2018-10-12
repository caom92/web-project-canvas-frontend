class SideNav {

  private $exists = false
  private $requiresSpace = false

  constructor(readonly isFixed: boolean) {
  }

  get exists(): boolean {
    return this.$exists
  }

  get requiresSpace(): boolean {
    return this.$requiresSpace
  }

  show(): void {
    this.$exists = true
    if (this.isFixed) {
      this.$requiresSpace = true
    }
  }

  hide(): void {
    this.$exists = false
    if (this.isFixed) {
      this.$requiresSpace = false
    }
  }
}


class Spinner {

  private $isVisible = true

  constructor() {
  }

  get isVisible(): boolean {
    return this.$isVisible
  }

  show(): void {
    this.$isVisible = true
  }

  hide(): void {
    this.$isVisible = false
  }
}


export abstract class GlobalMembersService {

  private $sideNav: SideNav
  private $spinner: Spinner

  constructor(
    readonly navBarColor = 'koi-orange',
    readonly isContentCentered = true,
    isSideNavFixed = true
  ) {
    this.$sideNav = new SideNav(isSideNavFixed)
    this.$spinner = new Spinner()
  }

  get sideNav(): Readonly<SideNav> {
    return this.$sideNav
  }

  get spinner(): Readonly<Spinner> {
    return this.$spinner
  }
}
