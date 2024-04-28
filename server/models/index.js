const { DataTypes, Sequelize } = require("sequelize");
const { pg } = require("../config");

const User = pg.define("user", {
    name: {
        type: DataTypes.STRING,
        defaultValue: "Anonymous",
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    indexes: [
        {
            unique: true,
            fields: ['email'],
            where: {
                email: {
                    [Sequelize.Op.not]: null
                }
            }
        }
    ]

});

const Document = pg.define("document", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    source: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    }
}, {
    indexes: [
        {
            fields: ['ownerId']
        },
        {
            unique: true,
            fields: ['ownerId', 'name']
        }
    ]
});

const Connection = pg.define("connection", {
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "users",
            key: "id",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    },
    documentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "documents",
            key: "id",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['email', 'documentId'],
            where: {
                email: {
                    [Sequelize.Op.not]: null
                }
            }
        },
        {
            unique: true,
            fields: ['userId', 'documentId'],
            where: {
                userId: {
                    [Sequelize.Op.not]: null
                }
            }
        },
        {
            fields: ['email'],
            where: {
                email: {
                    [Sequelize.Op.not]: null
                }
            }
        }
    ]
})

Connection.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE', hooks: true });
Connection.belongsTo(Document, { foreignKey: 'documentId', as: 'document', onDelete: 'CASCADE', hooks: true });
Document.belongsTo(User, { foreignKey: 'ownerId', as: 'owner', onDelete: 'CASCADE', hooks: true });
Document.belongsToMany(User, { through: Connection, as: 'users', onDelete: 'CASCADE', hooks: true });
User.hasMany(Document, { foreignKey: 'ownerId', as: 'ownedDocuments', onDelete: 'CASCADE', hooks: true });
User.belongsToMany(Document, { through: Connection, as: 'documents', onDelete: 'CASCADE', hooks: true });

(
    async () => await pg.sync({ alter: true })
        .then(() => console.log("DB: Models synced"))
        .catch((error) => console.error("DB: Failed to sync models", error))
)();

module.exports = {
    User,
    Document,
    Connection
};