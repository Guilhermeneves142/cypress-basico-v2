/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {

	beforeEach(() => {
		cy.visit("./src/index.html");
	})

  it("verifica o título da aplicação", function() {
		cy.title().should("be.equal","Central de Atendimento ao Cliente TAT")
  })

	it("preenche os campos obrigatórios e envia o formulário", function() {

		cy.get("input[id='firstName']")
		.type("Guilherme")

		cy.get("input[id='lastName']")
		.type("Neves")

		cy.get("input[id='email']")
		.type("guilherme@test.com")

		const longText = "teste,teste,teste,teste,teste,teste,teste,teste";
		cy.get("textarea[id='open-text-area']")
		// delay é o tempo que vai demorar escrevendo no campo
		.type(longText, { delay: 0})

		cy.contains("button",'Enviar')
		.click()
		
		cy.get(".success").should("be.visible")
	})

	it("exibe mensagem de erro ao submeter o formulário com um email com formatação inválida",
	function() {
		cy.get("input[id='firstName']")
		.type("Guilherme")

		cy.get("input[id='lastName']")
		.type("Neves")

		cy.get("input[id='email']")
		.type("guilherme@")

		cy.get("textarea[id='open-text-area']")
		.type('teste')

		cy.contains("button",'Enviar')
		.click()

		cy.get(".error").should("be.visible")
	})

	it("valida se o campo telefone aceita apena números", function() {
		cy.get("input[id='phone']")
		.type("abcdefghijklmnopqrstuvwxyz", {delay: 0})
		.should("have.value","")

	})

	it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", function() {
		cy.get("input[id='firstName']")
		.type("Guilherme")

		cy.get("input[id='lastName']")
		.type("Neves")

		cy.get("input[id='email']")
		.type("guilherme@test.com")

		cy.get('#phone-checkbox')
		.check()

		cy.get("textarea[id='open-text-area']")
		.type('teste')

		cy.contains("button",'Enviar')
		.click()

		cy.get(".error").should("be.visible")
	})

	it("preenche e limpa os campos nome, sobrenome, email e telefone",function() {
		cy.get("input[id='firstName']")
		.type("Guilherme")
		.should("have.value","Guilherme")
		.clear()
		.should("have.value","")

		cy.get("input[id='lastName']")
		.type("Neves")
		.should("have.value","Neves")
		.clear()
		.should("have.value","")

		cy.get("input[id='email']")
		.type("guilherme@test.com")
		.should("have.value","guilherme@test.com")
		.clear()
		.should("have.value","")

		cy.get('#phone-checkbox')
		.click()

		cy.get("input[id='phone']")
		.type("18991768804", {delay: 0})
		.should("have.value","18991768804")
	})

	it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", function() {
		cy.contains("button",'Enviar')
		.click()

		cy.get(".error").should("be.visible")
	})

	it("envia o formulário com sucesso usando um comando customizado", function() {
		cy.fillMandatoryFieldsAndSubmit();

		cy.get(".success").should("be.visible")
	})

	it("seleciona um produto (YouTube) por seu texto", function() {
		cy.get('#product')
		.select("YouTube")
		.should("have.value","youtube")
	})

	it("seleciona um produto (Mentoria) por seu texto", function() {
		cy.get('#product')
		.select("Mentoria")
		.should("have.value","mentoria")
	})

	it("seleciona um produto (Blog) por seu texto", function() {
		cy.get('#product')
		.select("Blog")
		.should("have.value","blog")
	})

	it("marca o tipo de atendimento 'Feedback'", function() {
		cy.get('input[name="atendimento-tat"][value="feedback"]')
		.check()
		.should("have.value","feedback")
	})

	it("marca cada tipo de atendimento", function() {
		cy.get('input[name="atendimento-tat"]')
		.should("have.length",3)
		.each((element) => {
			cy.wrap(element).check().should("be.checked")
		})
	})

	it("marca ambos checkboxes, depois desmarca o último", function() {
		cy.get("div#check > input[type='checkbox']")
		.each((element) => {
			cy.wrap(element).check().should("be.checked")
		})
		.last()
		.uncheck()
		.should("not.be.checked")
	})

	it("seleciona um arquivo da pasta fixtures", function() {
		cy.get('#file-upload')
		.selectFile("./cypress/fixtures/example.json")
		.should((input) => {
			expect(input[0].files[0].name).to.equals('example.json')
		})
	})

	it("seleciona um arquivo simulando um drag-and-drop", function() {
		cy.get('#file-upload')
		.selectFile("./cypress/fixtures/example.json", { action: "drag-drop"})
		.should((input) => {
			expect(input[0].files[0].name).to.equals('example.json')
		})
	})

	it("seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", function() {
		cy.fixture("example.json").as("sampleFile")
		cy.get('#file-upload')
		.selectFile("@sampleFile")
		.should((input) => {
			expect(input[0].files[0].name).to.equals('example.json')
		})
	})

	it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", function() {
		cy.get('a[href="privacy.html"]')
		.should('have.attr', 'target', '_blank')
	})

	it("acessa a página da política de privacidade removendo o target e então clicando no link", function() {
		cy.get('a[href="privacy.html"]')
		.invoke('removeAttr', 'target')
		.click();
	})
})
