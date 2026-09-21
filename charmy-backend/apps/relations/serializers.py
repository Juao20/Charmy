from rest_framework import serializers
from .models import Contact, Relation, RelationJournal

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'avatar', 'platform', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate(self, data):
        user = self.context['request'].user
        name = data.get('name')
        
        # Vérifier si un contact avec ce nom existe déjà pour cet utilisateur
        query = Contact.objects.filter(user=user, name=name)
        
        # Si c'est une mise à jour, exclure le contact actuel de la vérification
        if self.instance:
            query = query.exclude(id=self.instance.id)
        
        if query.exists():
            raise serializers.ValidationError(
                {"name": f"Tu as déjà un contact nommé '{name}'."}
            )
        return data


class RelationSerializer(serializers.ModelSerializer):
    contact = ContactSerializer(read_only=True)
    contact_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Relation
        fields = [
            'id', 'contact', 'contact_id', 'relation_type',
            'goal', 'tone', 'backstory', 'strategy',
            'health_score', 'last_interaction', 'created_at',
        ]
        read_only_fields = ['id', 'health_score', 'created_at']

    def validate_contact_id(self, value):
        user = self.context['request'].user
        if not Contact.objects.filter(id=value, user=user).exists():
            raise serializers.ValidationError("Ce contact ne t'appartient pas.")
        return value


class RelationJournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = RelationJournal
        fields = ['id', 'note', 'event_type', 'event_date', 'created_at']
        read_only_fields = ['id', 'created_at']


class JournalEntrySerializer(serializers.ModelSerializer):
    """Entrée de journal avec le contexte de la relation — utilisée par la page Journal globale."""
    relation_id = serializers.UUIDField(write_only=True)
    relation_name = serializers.CharField(source='relation.contact.name', read_only=True)

    class Meta:
        model = RelationJournal
        fields = [
            'id', 'relation_id', 'relation_name', 'note',
            'event_type', 'event_date', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def validate_relation_id(self, value):
        user = self.context['request'].user
        if not Relation.objects.filter(id=value, user=user).exists():
            raise serializers.ValidationError("Cette relation ne t'appartient pas.")
        return value