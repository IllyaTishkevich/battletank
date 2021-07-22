'use strict';
class Storage {
    constructor(name) {
        this.url = 'https://fe.it-academy.by/AjaxStringStorage2.php';
        this.name = name;
        this.password = Date.now();
    }

    ajaxInsert(data) {
        $.ajax({
            url: this.url,
            type: 'POST', dataType: 'json',
            data: {f: 'INSERT', n: this.name, v: data},
            cache: false,
            success: function (data) {
                console.log(data)
            },
            error: function (err) {
                console.error(err)
            },
        });
    }

    ajaxUpdate(data) {
        $.ajax({
                url: this.url,
                type: 'POST', dataType: 'json',
                data: {f: 'UPDATE', n: this.name, v: data, p: this.password},
                cache: false,
                success: function (data) {
                    console.log(data)
                },
                error: function (err) {
                    console.error(err)
                },
            });
    }

    updateData(data) {
        const self = this;
        $.ajax( {
                url : this.url,
                type : 'POST', dataType:'json',
                data : { f : 'LOCKGET', n : this.name, p : this.password },
                cache : false,
                success : function (resp) {
                    self.ajaxUpdate(data)
                },
                error : function (err) {
                    console.error(err)
                },
            }
        );
    }

    ajaxGet(model) {
        $.ajax({
            url: this.url,
            type: 'POST', dataType: 'json',
            data: {f: 'READ', n: this.name},
            cache: false,
            success: function (data) {
                const result = data.result;
                console.log(result)
                model.bestScore = result === '' ? 0 : result;
            },
            error: function (err) {
                console.error(err)
            },
        });
    }
}