describe('Home', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/')
  })
  // ホーム（ログイン後）
  // タスク追加
  // タスク更新
  // タスク削除
  // タスクセット
  // ドラッグ
  it('creates a new task', () => {
    cy.get('.today-column')
      .contains('タスクを追加')
      .click()

    cy.get('.today-column form').within(() => {
      cy.get('.el-input input')
        .eq(0)
        .type('新しいタスク1')
      cy.get('.el-input input')
        .eq(1)
        .type(30)

      cy.contains('button', '追加')
        .click()
      cy.get('.close-btn')
        .click()
    })

    cy.get('.task-board__p')
      .should('contain', '新しいタスク1')
      .and('contain', '30分')

    cy.get('.task-board__header')
      .should('contain', '30分')
  })

  it('updates a task', () => {
    cy.contains('新しいタスク1')
      .click()

    cy.get('.today-column form').within(() => {
      cy.get('.el-input input')
        .eq(0)
        .clear()
        .type('変更されたタスク1')
      cy.get('.el-input input')
        .eq(1)
        .clear()
        .type(60)

      cy.contains('button', '更新')
        .click()
    })

    cy.get('.task-board__p')
      .should('contain', '変更されたタスク1')
      .and('contain', '60分')

    cy.get('.task-board__header')
      .should('contain', '1時間0分')
  })

  it('destroys a task', () => {
    cy.contains('変更されたタスク1')
      .click()

    cy.get('.today-column form').within(() => {
      cy.get('.delete-btn')
        .click()
    })

    cy.get('.task-board__p')
      .should('not.exist')

    cy.get('.task-board__header')
      .contains('1時間0分')
      .should('not.exist')
  })
})
