import cssParser from 'css';

export default class Utils {
    static deepcopy(obj) {
        return JSON.parse(JSON.stringify(obj))
    }

    static loop(item, handle) {
        const localLoop = (parent) => {
            handle(parent);
            parent.children.forEach(child=> localLoop(child));
        }
        localLoop(item)
    }

    static maxId(item) {
        let id = 0;
        Utils.loop(item, (child=> {
            if (id < child.id) {
                id = child.id;
            }
        }));
        return id;
    }

    static equal(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    static merge(a, b) {
        Object.keys(b).forEach(k=> {
            a[k] = b[k];
        });
        return a;
    }

    static transform(inputCssText) {
        const transformRules = (self, rules, result) => {
            rules.forEach(function (rule) {
                var obj = {};
                if (rule.type === 'media') {
                    var name = mediaNameGenerator(rule.media);
                    var media = result[name] = result[name] || {
                        "__expression__": rule.media
                    };
                    transformRules(self, rule.rules, media)
                } else if (rule.type === 'rule') {
                    rule.declarations.forEach(function (declaration) {
                        if (declaration.type === 'declaration') {
                            var cleanProperty = cleanPropertyName(declaration.property);
                            obj[cleanProperty] = declaration.value;
                        }
                    });
                    rule.selectors.forEach(function (selector) {
                        var name = nameGenerator(selector.trim());
                        result[name] = obj;
                    });
                }
            });
        }

        const cleanPropertyName = (name) => {
            // turn things like 'align-items' into 'alignItems'
            name = name.replace(/(-.)/g, function(v) { return v[1].toUpperCase(); })

            return name;
        }

        const mediaNameGenerator = (name) => {
            return '@media ' + name;
        }

        const nameGenerator = (name) => {
            name = name.replace(/\s\s+/g, ' ');
            name = name.replace(/[^a-zA-Z0-9]/g, '_');
            name = name.replace(/^_+/g, '');
            name = name.replace(/_+$/g, '');

            return name;
        }

        if(!inputCssText) {
            throw new Error('missing css text to transform');
        }

        // If the input "css" doesn't wrap it with a css class (raw styles)
        // we need to wrap it with a style so the css parser doesn't choke.
        var bootstrapWithCssClass = false;
        if(inputCssText.indexOf("{") === -1) {
            bootstrapWithCssClass = true;
            inputCssText = `.bootstrapWithCssClass { ${inputCssText} }`;
        }

        var css = cssParser.parse(inputCssText);
        var result = {};
        transformRules(this, css.stylesheet.rules, result);

        // Don't expose the implementation detail of our wrapped css class.
        if(bootstrapWithCssClass) {
            result = result.bootstrapWithCssClass;
        }

        return result;
    }
}
